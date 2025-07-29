import assistantIcon from "../assets/images/profile.jpg"

const AssistantButton = () => {
  const handleClick = () => {
    window.location.href = "https://amamiyakun02.github.io/PersonalAssistant";
  };

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-[40px] right-[-100px] z-30 bg-white shadow-md border border-slate-200 rounded-full px-4 py-2 flex items-center gap-2 hover:bg-slate-100 transition"
    >
      <img src={assistantIcon} alt="Assistant" className="w-6 h-6 rounded-full" />
      <span className="text-sm font-medium text-slate-800">Chat with my Assistant</span>
    </button>
  );
};

export default AssistantButton
