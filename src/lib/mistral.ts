const MISTRAL_API_KEY = 'IHWif4ssTtQN1RtG36VRHLepZ5DpkjxI';
const MISTRAL_OCR_URL = 'https://api.mistral.ai/v1/ocr';

interface MistralOCRResponse {
  pages: {
    index: number;
    markdown: string;
  }[];
}

async function chunkFile(file: File, chunkSize: number = 5 * 1024 * 1024): Promise<Blob> {
  if (file.size <= chunkSize) {
    return file;
  }
  
  // Read only the first part of the file
  const chunk = file.slice(0, chunkSize);
  return new Blob([chunk], { type: file.type });
}

// Helper function to extract text from PDF using PDF.js
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Import PDF.js dynamically
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '';
  }
}

// Create a temporary URL for the file
async function createTempFileUrl(file: File): Promise<string | null> {
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload to a temporary file hosting service
    // For demo purposes, we'll use a mock URL
    // In production, you'd use a real file hosting service
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error creating temp URL:', error);
    return null;
  }
}

export async function analyzeDocument(file: File) {
  try {
    console.log('Starting OCR process...', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

    // Try to extract text locally first for PDFs
    let extractedText = '';
    if (file.type === 'application/pdf') {
      console.log('Attempting local PDF text extraction...');
      extractedText = await extractTextFromPDF(file);
      console.log('Local extraction result length:', extractedText.length);
    }

    // If local extraction failed or returned little text, try Mistral OCR
    if (extractedText.length < 500) {
      try {
        console.log('Attempting Mistral OCR...');
        
        // Chunk the file if it's too large
        const processableFile = await chunkFile(file);
        console.log('Processable file size:', processableFile.size);
        
        // Try URL-based approach first (like in Edge Function)
        const tempUrl = await createTempFileUrl(processableFile);
        
        if (tempUrl) {
          // Make OCR request with URL
          const ocrResponse = await fetch(MISTRAL_OCR_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
              url: tempUrl,
              format: "json"
            })
          });
          
          console.log('OCR Response status:', ocrResponse.status);
          
          if (ocrResponse.ok) {
            const ocrData = await ocrResponse.json();
            console.log('OCR Success - Raw response:', ocrData);
            
            if (ocrData.text) {
              extractedText = ocrData.text;
            } else if (ocrData.pages && Array.isArray(ocrData.pages)) {
              extractedText = ocrData.pages
                .sort((a, b) => a.index - b.index)
                .map(page => page.markdown)
                .join('\n\n');
            }
          } else {
            const errorText = await ocrResponse.text();
            console.error('OCR Error response:', errorText);
            // Continue with local extraction if available
          }
        }
      } catch (ocrError) {
        console.error('OCR processing error:', ocrError);
        // Continue with local extraction if available
      }
    }

    // If we still don't have text, return an error
    if (extractedText.length < 100) {
      console.error('Failed to extract meaningful text from document');
      return {
        ocr_text: "Failed to extract text from document. Please try a different file format.",
        analysis: { error: "Text extraction failed" }
      };
    }

    console.log('Extracted text sample:', extractedText.slice(0, 500));

    // Now analyze the extracted text
    console.log('Starting text analysis...');
    const analysisResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages: [
          {
            role: "system",
            content: "Extract key information from RFP documents into structured data."
          },
          {
            role: "user",
            content: `Extract key information from this RFP text into JSON format with fields for project_name, deadline, budget, and requirements:\n\n${extractedText.slice(0, 4000)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" } // Ensure JSON response
      })
    });

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.json();
      console.error('Analysis API error:', errorData);
      throw new Error('Failed to analyze document');
    }

    const analysisData = await analysisResponse.json();
    console.log('Analysis response:', analysisData);

    // Parse the analysis content
    let analysis = {};
    try {
      if (typeof analysisData.choices[0].message.content === 'string') {
        analysis = JSON.parse(analysisData.choices[0].message.content);
      } else {
        analysis = analysisData.choices[0].message.content;
      }
    } catch (error) {
      console.error('Error parsing analysis JSON:', error);
      analysis = { error: 'Failed to parse analysis results' };
    }

    return {
      ocr_text: extractedText,
      analysis: analysis
    };
  } catch (error) {
    console.error('Fatal error in OCR/Analysis process:', error);
    throw error;
  }
}