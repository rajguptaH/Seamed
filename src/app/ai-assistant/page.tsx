
'use client';

import { useState, useActionState, useRef, useEffect } from 'react';
import { Bot, User, CornerDownLeft, Upload, FileText, Loader, BookMarked, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { askAIAssistant } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  error?: string;
}

interface Document {
    name: string;
    pages: number;
}

// Placeholder for uploaded documents state
const initialDocuments: Document[] = [
    { name: 'International Medical Guide for Ships', pages: 118 },
    { name: 'Ship Captain\'s Medical Guide', pages: 250 },
    { name: 'Emergency First Aid Protocols', pages: 45 },
];


export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [state, formAction, isPending] = useActionState(askAIAssistant, null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  useEffect(() => {
    if (state) {
      if (state.role === 'assistant' && state.content) {
        setMessages(prev => [...prev, state]);
      } else if (state.error) {
         toast({
          title: "AI Error",
          description: state.error,
          variant: "destructive",
        });
      }
    }
  }, [state, toast]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to a server,
      // process it (e.g., extract text, chunk it, create embeddings),
      // and store it in a vector database.
      // For now, we'll just simulate adding it to the list.
      const newDocument: Document = {
        name: file.name,
        pages: Math.ceil(file.size / 4000), // Approximate pages
      };
      setDocuments(prev => [...prev, newDocument]);
      toast({
        title: "Document Added",
        description: `${file.name} has been added to the knowledge base.`,
      });
    }
  };

  const removeDocument = (docName: string) => {
    setDocuments(prev => prev.filter(doc => doc.name !== docName));
    toast({
        title: "Document Removed",
        description: `${docName} has been removed from the knowledge base.`,
        variant: "destructive"
      });
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-background pt-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                AI Medical Assistant
              </CardTitle>
              <CardDescription>
                Ask questions and get guidance based on the uploaded medical documents.
              </CardDescription>
            </div>
             <Button variant="outline" onClick={handleUploadClick}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
            </Button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.txt,.md"
            />
          </div>
          <Separator className="my-4" />
           <div>
                <h3 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2"><BookMarked className="h-4 w-4" /> Knowledge Base</h3>
                <div className="space-y-2">
                    {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm group">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="truncate max-w-xs">{doc.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{doc.pages} pages</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeDocument(doc.name)}>
                                    <X className="h-4 w-4 text-destructive"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CardHeader>
        <CardContent className="h-[400px] overflow-y-auto p-4 border-t border-b">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
              </div>
            ))}
            {isPending && (
                <div className="flex items-start gap-4">
                    <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="rounded-lg px-4 py-2 bg-muted">
                        <Loader className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
            {messages.length === 0 && !isPending && (
                <div className="text-center text-muted-foreground p-8">
                    <p>No conversation started yet. Ask a question below.</p>
                </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4">
           <form 
              action={(formData) => {
                const query = formData.get('query') as string;
                if (!query?.trim()) return;

                setMessages(prev => [...prev, { role: 'user', content: query }]);
                formAction(formData);
                setInput('');
              }}
              ref={formRef} 
              className="w-full flex items-center gap-2"
            >
            <Textarea
              name="query"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'What are the steps for treating a second-degree burn?'"
              className="min-h-12 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              disabled={isPending}
            />
            <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
              <CornerDownLeft className="h-5 w-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
