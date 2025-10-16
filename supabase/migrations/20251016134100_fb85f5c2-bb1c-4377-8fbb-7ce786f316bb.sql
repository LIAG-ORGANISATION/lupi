-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  dog_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(owner_id, professional_id, dog_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('owner', 'professional')),
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "owners_view_own_conversations"
ON public.conversations
FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "pros_view_own_conversations"
ON public.conversations
FOR SELECT
USING (professional_id = auth.uid());

CREATE POLICY "owners_create_conversations"
ON public.conversations
FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "pros_create_conversations"
ON public.conversations
FOR INSERT
WITH CHECK (professional_id = auth.uid());

CREATE POLICY "participants_update_conversations"
ON public.conversations
FOR UPDATE
USING (owner_id = auth.uid() OR professional_id = auth.uid());

-- RLS policies for messages
CREATE POLICY "conversation_participants_view_messages"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = messages.conversation_id
    AND (owner_id = auth.uid() OR professional_id = auth.uid())
  )
);

CREATE POLICY "conversation_participants_send_messages"
ON public.messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = conversation_id
    AND (owner_id = auth.uid() OR professional_id = auth.uid())
  )
);

CREATE POLICY "message_sender_update_own_messages"
ON public.messages
FOR UPDATE
USING (sender_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_conversations_owner ON public.conversations(owner_id);
CREATE INDEX idx_conversations_professional ON public.conversations(professional_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Create trigger to update conversation last_message_at
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_timestamp
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_message();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;