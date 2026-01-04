import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Button, Textarea, Label } from "@shared/ui";

interface RejectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
    isPending: boolean;
}

export const RejectDialog = ({ open, onOpenChange, onConfirm, isPending }: RejectDialogProps) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError("Rejection reason is required");
            return;
        }
        onConfirm(reason);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Document</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for rejecting this document. This will be sent to the author.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                            id="reason"
                            placeholder="e.g. Inappropriate content, Low quality..."
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (e.target.value.trim()) setError("");
                            }}
                            className={error ? "border-red-500" : ""}
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Rejecting..." : "Reject Document"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
