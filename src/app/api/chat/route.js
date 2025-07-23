import { NextResponse } from 'next/server';

export async function POST(request) {
  // Set response headers for JSON
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    console.log('Received request:', request.method, request.url);
    
    // Parse the request body
    let messages;
    try {
      const body = await request.json();
      if (!body || !Array.isArray(body.messages)) {
        throw new Error('Invalid messages format');
      }
      messages = body.messages;
      console.log('Received messages:', JSON.stringify(messages, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request body',
          details: parseError.message 
        }), 
        { 
          status: 400, 
          headers 
        }
      );
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    console.log('OpenAI Key available:', !!openAiKey);
    
    // If no OpenAI key is set, return a mock response
    if (!openAiKey) {
      const mockResponses = [
        "I'm a mock response. Please set up your OpenAI API key for real responses.",
        "This is a simulated response. Add your OpenAI API key to get real AI responses.",
        "Mock response: I'm here to help! To enable real AI responses, please configure your OpenAI API key."
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return NextResponse.json({
        id: 'mock-' + Date.now(),
        content: randomResponse,
        role: 'assistant',
        timestamp: new Date().toISOString()
      });
    }

    // If OpenAI key is available, make the actual API call
    let response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('OpenAI API error:', data);
        
        // Handle specific error cases
        if (data.error?.code === 'insufficient_quota' || 
            data.error?.message?.includes('quota') || 
            data.error?.message?.includes('billing')) {
          throw new Error(
            'API quota exceeded. Please check your OpenAI account billing status. "' + 
            (data.error?.message || 'Insufficient quota') + '"'
          );
        }
        
        throw new Error(data.error?.message || 'Failed to get response from OpenAI');
      }
      
      const aiMessage = data.choices[0].message;
      return {
        id: data.id,
        content: aiMessage.content,
        role: aiMessage.role,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error; // Re-throw to be handled by the outer catch
    }

    return NextResponse.json({
      id: data.id,
      content: aiMessage.content,
      role: aiMessage.role,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred while processing your request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
