import { MoreHorizontal, Check, X, Eye, Loader2 } from "lucide-react";
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@shared/ui";
import { Document } from "@entities/document/model/schema";
import { useApproveDocument, useRejectDocument } from "../model/use-admin-actions";
import { useState } from "react";
import { RejectDialog } from "./reject-dialog";

interface ActionCellProps {
    document: Document;
}

export const ActionCell = ({ document }: ActionCellProps) => {
    const [rejectOpen, setRejectOpen] = useState(false);
    const approveMutation = useApproveDocument();
    const rejectMutation = useRejectDocument();

    // Handle case-insensitive status just in case, though schema normalizes it.
    const status = document.status.toUpperCase();
    const isProcessing = status === "PROCESSING";
    const isPending = status === "PENDING";

    const onApprove = () => {
        approveMutation.mutate(document.id);
    };

    const onReject = (reason: string) => {
        rejectMutation.mutate({ id: document.id, reason }, {
            onSuccess: () => setRejectOpen(false)
        });
    };

    if (isProcessing) {
        return (
            <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="sr-only">Processing...</span>
            </div>
        );
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => window.open(document.fileUrl, '_blank')}>
                        <Eye className="mr-2 h-4 w-4" /> View Document
                    </DropdownMenuItem>

                    {isPending && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onApprove} className="text-green-600 focus:text-green-600 cursor-pointer">
                                <Check className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRejectOpen(true)} className="text-red-600 focus:text-red-600 cursor-pointer">
                                <X className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <RejectDialog
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                onConfirm={onReject}
                isPending={rejectMutation.isPending}
            />
        </>
    );
};
