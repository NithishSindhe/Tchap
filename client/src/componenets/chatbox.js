import "./css/chatbox.css"
function Chatbox(elements) {
    
    return (

        <div className="chatbox">
            <span className="allMessages">
                {elements.messages.map( (object,key) =>{
                    return (object.userName)?(<p key = {key} className="theMessage">{object.userName}{'>'}{object.theMessage}</p>):(<p key = "convStart"className="centerParagraph">Have fun texting </p>)
                })}
            </span>
        </div>
    );
}
export default Chatbox;