export const Button = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => {
    return (
      <button 
        onClick={onClick} 
        className="px-6 py-2 text-lg bg-green-500 hover:bg-green-700 text-white font-bold rounded-md"
      >
        {children}
      </button>
    );
  };
  