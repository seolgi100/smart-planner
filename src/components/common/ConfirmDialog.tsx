interface Props {
    message: string;
    subMessage?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({ message, subMessage, confirmLabel = '삭제', onConfirm, onCancel }: Props) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        onClick={(e) => { e.stopPropagation(); onCancel(); }}
    >
        <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
        >
            <p className="text-base font-semibold text-gray-800 text-center">{message}</p>
            {subMessage && (
                <p className="text-sm text-gray-400 text-center mt-1">{subMessage}</p>
            )}
            <div className="flex gap-3 mt-6">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    취소
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmDialog;