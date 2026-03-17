'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useUIStore from '@/store/useUIStore';
import useTaskStore from '@/store/useTaskStore';
import useNoteStore from '@/store/useNoteStore';
import useEventStore from '@/store/useEventStore';
import { toast } from 'sonner';

export default function CreateModal() {
  const { isCreateModalOpen, createType, closeCreateModal } = useUIStore();
  const { addTask } = useTaskStore();
  const { addNote } = useNoteStore();
  const { addEvent } = useEventStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      if (createType === 'task') {
        await addTask({ title: title.trim(), priority: 'medium' });
        toast.success('Task created successfully');
      } else if (createType === 'note') {
        await addNote({ title: title.trim(), content: description.trim(), tags: [] });
        toast.success('Note created successfully');
      } else if (createType === 'event') {
        await addEvent({ 
          title: title.trim(), 
          description: description.trim(), 
          date: new Date(), 
          startTime: '10:00',
          location: ''
        });
        toast.success('Event scheduled successfully');
      }
      handleClose();
    } catch (error) {
      console.error('Create error:', error);
      toast.error(`Failed to create ${createType}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    closeCreateModal();
  };

  const titles = {
    task: 'Create New Task',
    note: 'Create New Note',
    event: 'Schedule New Event'
  };

  const placeholders = {
    task: 'Enter task title...',
    note: 'Enter note title...',
    event: 'Enter event title...'
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{titles[createType] || 'Create New Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
            <Input
              id="title"
              placeholder={placeholders[createType] || 'Enter title...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="h-10"
            />
          </div>
          {(createType === 'note' || createType === 'event') && (
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {createType === 'note' ? 'Content' : 'Description'}
              </Label>
              <Input
                id="description"
                placeholder={createType === 'note' ? 'Enter content...' : 'Enter description...'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-10"
              />
            </div>
          )}
          <DialogFooter className="pt-4 gap-2">
            <Button type="button" variant="outline" onClick={handleClose} className="h-9">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="h-9 min-w-[80px]">
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
