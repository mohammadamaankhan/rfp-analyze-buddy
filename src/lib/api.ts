import { supabaseClient } from './supabase';
import { analyzeDocument } from './mistral';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function uploadDocument(file: File) {
  try {
    // Get the current user's ID
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Authentication required');
    }

    console.log('Current user:', user); // Debug log

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    
    // First, upload to Supabase storage
    const { data: storageData, error: storageError } = await supabaseClient
      .storage
      .from('documents')
      .upload(fileName, file);

    if (storageError) {
      console.error('Storage error:', storageError);
      throw new Error('Failed to upload file to storage');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('documents')
      .getPublicUrl(fileName);

    // Process with Mistral OCR
    let ocrResult = null;
    try {
      console.log('Starting Mistral OCR processing...');
      ocrResult = await analyzeDocument(file);
      console.log('OCR processing completed');
    } catch (ocrError) {
      console.error('OCR processing error:', ocrError);
      // Continue with upload even if OCR fails
    }

    // Prepare the document data
    const documentData = {
      user_id: user.id,
      file_name: file.name,
      file_path: fileName,
      file_size: Math.floor(file.size),
      file_type: file.type,
      file_url: publicUrl,
      ocr_text: ocrResult?.ocr_text || null,
      analysis: ocrResult?.analysis || null
    };

    // Create a record in the documents table
    const { data: document, error: dbError } = await supabaseClient
      .from('documents')
      .insert([documentData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to create document record');
    }

    return document;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
} 