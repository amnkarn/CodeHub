type FlashProps = {
    message: string;
    type?: 'success' | 'error'; // Defaults to success if not provided
};

export default function Flash({ message, type = 'success' }: FlashProps) {
    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div 
            className={`absolute top-4 right-10 z-50 flex items-start sm:items-center p-4 text-sm rounded-lg border shadow-md transition-all
                ${isSuccess 
                    ? 'text-green-900 bg-green-200 border-green-300' 
                    : 'text-red-900 bg-red-200 border-red-300'
                }`} 
            role="alert"
        >
            <svg 
                className={`w-5 h-5 me-3 shrink-0 mt-0.5 sm:mt-0 ${isSuccess ? 'text-green-700' : 'text-red-700'}`} 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2"
            >
                {isSuccess ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
            </svg>
            
            <div>
                <span className="font-semibold me-1">
                    {isSuccess ? 'Success!' : 'Error!'}
                </span> 
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
}