<script>
  import OpenAI from "openai";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  export let recentMessages = [];
  let processingCommand = false;
  let lastResponseTime = 0;
  const MIN_RESPONSE_INTERVAL = 30000; // Minimum 30 seconds between random responses
  
  async function handleCommand(command, messageText) {
    if (processingCommand) return;
    processingCommand = true;
    
    try {
      if (messageText.startsWith('&&')) {
        const prompt = await generateImagePrompt(recentMessages.slice(-5).map(msg => `${msg.username}: ${msg.message}`).join('\n'));
        const imageUrl = await generateImage(prompt);
        dispatch('aiMessage', {
          message: `![Generated Image](${imageUrl})`,
          username: 'Kuhilligence',
          timestamp: new Date(),
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kuhilligence',
          isImage: true
        });
      } else {
        let response;
        switch (command) {
          case '$joke':
            response = await generateJoke(recentMessages.slice(-5).map(msg => `${msg.username}: ${msg.message}`).join('\n'));
            break;
          case '$summary':
            response = await generateSummary(recentMessages.slice(-5).map(msg => `${msg.username}: ${msg.message}`).join('\n'));
            break;
          default:
            return;
        }
        
        dispatch('aiMessage', {
          message: response,
          username: 'Kuhilligence',
          timestamp: new Date(),
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kuhilligence'
        });
      }
    } catch (error) {
      console.error('Error processing AI command:', error);
    } finally {
      processingCommand = false;
    }
  }

  async function generateImagePrompt(context) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating detailed, creative image generation prompts. Based on the chat context, create a prompt that would generate an interesting and relevant image. Focus on visual details, style, mood, and composition. Return ONLY the prompt, no additional text."
        },
        {
          role: "user",
          content: `Based on this chat context:\n${context}\n\nCreate a detailed image generation prompt that captures the essence or theme of the conversation.`
        }
      ],
      temperature: 0.9,
      max_tokens: 150
    });
    return completion.choices[0].message.content;
  }

  async function generateImage(prompt) {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      });
      return response.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  async function generateJoke(context) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are a witty AI assistant that generates contextual jokes. Keep responses concise and entertaining."
        },
        {
          role: "user",
          content: `Based on this chat context:\n${context}\n\nGenerate a clever and relevant joke. Make it witty and contextual if possible.`
        }
      ],
      temperature: 0.8,
      max_tokens: 100
    });
    return completion.choices[0].message.content;
  }

  async function generateSummary(context) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that summarizes chat conversations concisely and engagingly."
        },
        {
          role: "user",
          content: `Summarize this chat conversation in a concise and engaging way:\n${context}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });
    return completion.choices[0].message.content;
  }

  async function generateContextualEmoji(context) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are an AI that generates contextual emoji reactions with brief, witty comments (1-2 words max). Your responses should be in the format: 'emoji comment'. Example: '🤔 hmm...' or '😂 classic!'"
        },
        {
          role: "user",
          content: `Based on this recent message:\n${context}\n\nGenerate a contextual emoji reaction with a very brief comment.`
        }
      ],
      temperature: 0.9,
      max_tokens: 20
    });
    return completion.choices[0].message.content;
  }

  export async function maybeReactWithEmoji() {
    const now = Date.now();
    if (now - lastResponseTime < MIN_RESPONSE_INTERVAL) {
      return; // Don't respond if not enough time has passed
    }

    if (Math.random() < 0.1) { // Reduced to 10% chance to react
      const lastMessage = recentMessages[recentMessages.length - 1];
      if (lastMessage && !lastMessage.message.startsWith('$') && !lastMessage.message.startsWith('&&')) {
        const reaction = await generateContextualEmoji(lastMessage.message);
        dispatch('aiMessage', {
          message: reaction,
          username: 'Kuhilligence',
          timestamp: new Date(),
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kuhilligence'
        });
        lastResponseTime = now;
      }
    }
  }

  $: {
    if (recentMessages.length > 0) {
      const lastMessage = recentMessages[recentMessages.length - 1];
      if (lastMessage.message.startsWith('$') || lastMessage.message.startsWith('&&')) {
        handleCommand(lastMessage.message.trim(), lastMessage.message);
      } else {
        maybeReactWithEmoji();
      }
    }
  }
</script>
