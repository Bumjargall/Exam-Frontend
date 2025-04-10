import Link from "next/link"
export default function SaveQuestion({text}:{text:string}){
    return(
        <div className="rounded-b-lg border-t">
            <div className="py-5">
                <div className="text-center text-gray-900">
                    <Link href="" className="py-2 border border-gray-900 px-4 rounded-2xl hover:bg-gray-100">{text}</Link>
                </div>
            </div>
        </div>
    )
}