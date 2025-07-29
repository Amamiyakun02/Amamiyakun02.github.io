import avatar from "../assets/images/profile.jpg"

const AssistantButton = () => {
  return (
    <div className="absolute bottom-4 right-4 flex items-center space-x-2">
      <div className="bg-white px-3 py-1 rounded-full shadow text-sm font-semibold">
        Chat with <br /> My Assistant
      </div>
      <img src={avatar} className="w-12 h-12 rounded-full border-2 border-white shadow" alt="assistant" />
    </div>
  )
}

export default AssistantButton
