import React from "react"

const Card = ({ title, total }: { title: string; total: number }) => {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      <div className="p-4 border-l-4 border-[#118CDB] rounded-lg">
        <h2 className="font-semibold transition-colors duration-200">{title}</h2>
        <p className="text-[#404040] mt-1 text-2xl font-bold transition-all duration-200">{total}</p>
      </div>
    </div>
  )
}

export default Card
