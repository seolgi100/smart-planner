interface Props {
    message?: string;
}

const EmptyState = ({ message = '항목이 없습니다.' }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-sm">{message}</p>
        </div>
    );
};

export default EmptyState;