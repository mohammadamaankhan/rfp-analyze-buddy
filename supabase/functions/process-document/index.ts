
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
if (!mistralApiKey) {
  throw new Error('MISTRAL_API_KEY is not set');
}

interface RequestBody {
  fileUrl: string;
  documentId: string;
  userId: string;
}

Deno.serve(async (req) => {
  // CORS handling
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const body = await req.json() as RequestBody;
    const { fileUrl, documentId, userId } = body;

    if (!fileUrl || !documentId || !userId) {
      return new Response(
        JSON.stringify({ error: 'fileUrl, documentId and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing document: ${documentId} for user: ${userId}`);
    console.log(`File URL: ${fileUrl}`);

    // Call Mistral OCR API
    const ocrResponse = await fetch("https://api.mistral.ai/v1/ocr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mistralApiKey}`
      },
      body: JSON.stringify({
        url: fileUrl, // Public URL of the file
        format: "text", // format can be 'text' or 'json'
      })
    });

    if (!ocrResponse.ok) {
      const errorBody = await ocrResponse.text();
      console.error(`Mistral API error: ${ocrResponse.status} - ${errorBody}`);
      return new Response(
        JSON.stringify({ error: `OCR processing failed: ${ocrResponse.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ocrData = await ocrResponse.json();
    console.log("OCR processing successful");

    // Connect to Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First, check if there's already an analysis for this document
    const { data: existingAnalysis } = await supabaseClient
      .from('document_analyses')
      .select('id')
      .eq('document_id', documentId)
      .limit(1);

    // Create a basic initial analysis record with the OCR text
    // We'll populate more fields after AI processing
    if (!existingAnalysis || existingAnalysis.length === 0) {
      const { error: insertError } = await supabaseClient
        .from('document_analyses')
        .insert({
          document_id: documentId,
          user_id: userId,
          summary: ocrData.text, // Store raw OCR text in summary field initially
        });

      if (insertError) {
        console.error('Error inserting document analysis:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to save document analysis' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Update existing analysis with OCR text
      const { error: updateError } = await supabaseClient
        .from('document_analyses')
        .update({ summary: ocrData.text })
        .eq('id', existingAnalysis[0].id);

      if (updateError) {
        console.error('Error updating document analysis:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update document analysis' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, text: ocrData.text }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
