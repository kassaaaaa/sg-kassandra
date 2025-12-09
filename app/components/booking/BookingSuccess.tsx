'use client';

import { CheckCircle, Copy, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BookingSuccessProps {
  bookingReference: string;
  lessonName: string;
  startTime: string; // ISO string
  location?: string;
  instructorName?: string;
  onClose: () => void;
}

export function BookingSuccess({
  bookingReference,
  lessonName,
  startTime,
  location = 'Sandy Point Beach', // Default as per AC/Context usually implies a specific location or provided by lesson
  instructorName,
  onClose,
}: BookingSuccessProps) {
  const formattedDate = format(new Date(startTime), 'EEEE, MMM d, yyyy @ h:mm a');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingReference);
    // Optional: could add a toast here for "Copied!" feedback
  };

  return (
    <div className="flex flex-col space-y-6">
      <DialogHeader>
        <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-green-600 flex items-center">
            <CheckCircle className="mr-2 h-6 w-6" />
            Booking Confirmed!
            </DialogTitle>
            {/* Close button provided by Dialog primitive usually, but AC asks for "Close" button. 
                We can add a redundant one or rely on the main action button. 
                The AC says "Provides a 'Close' button (and 'X' icon)". 
                Dialog usually has X icon. We'll add a main Close button at bottom.
            */}
        </div>
      </DialogHeader>

      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          Your lesson has been successfully booked. A confirmation email has been sent.
        </p>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Booking Reference</span>
            <div className="flex items-center space-x-2">
              <code className="text-lg font-bold bg-background px-3 py-1 rounded border">
                {bookingReference}
              </code>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Lesson Type:</span>
              <span>{lessonName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Date & Time:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Location:</span>
              <span>{location}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Instructor:</span>
              <span>{instructorName || 'Instructor Assigned Soon'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onClose} className="w-full sm:w-auto">
          Close
        </Button>
      </div>
    </div>
  );
}
