//examData-аас шалгалтын гарчгийг шүүж харуулах
export default function SelectExamComponent({exams, onMouseLeave, onClickExam}: {
    exams: {id:string; title:string; }[];
    onMouseLeave: () => void;
    onClickExam: (exam: {id: string; title:string}) => void;
    }) {
    const safeExams = exams || []
    return (

        <div className="absolute left-1/8 z-10 mt-0 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" 
            aria-orientation="vertical" 
            aria-labelledby="menu-button"
            onMouseLeave={onMouseLeave}
            >
            <div className="py-1" role="none">
                { safeExams.map((e, index)=> (
                    <div key={e.id} className="block px-4 py-2 border-b-1 border-gray-100 text-sm text-gray-700 hover:bg-gray-500 hover:text-gray-100 focus:bg-gray-100 focus:text-gray-900 focus:outline-hidden cursor-pointer"  
                    role="menuitem" 
                    onClick={()=>{
                        onClickExam(e)
                    }}
                    >
                        {index+1}. {e.title}
                    </div>))
                }
            </div>
        </div>
    )
}