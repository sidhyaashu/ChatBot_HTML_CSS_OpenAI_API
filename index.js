const sendBtn = document.querySelector(".chat_input span");
const chatInput = document.querySelector(".chat_input textarea");
const chatbox = document.querySelector(".chat_box");
const chatToggler = document.querySelector(".chatbot_toggle");


let userMessage;
const API_KEY = "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";
const inputInHeight = chatInput.scrollHeight

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p> ${message} </p>`
      : `<span><img src="./c.png" alt="bot"></span>
                <p>${message} </p>`;

    chatLi.innerHTML = chatContent
    return chatLi

};

const generateResponse = (incomingChatLi) => {
  const API_UTL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p")


  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  };

  fetch(API_UTL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
    //   messageElement.textContent = data.choices[0].message.content
    })
    .catch((err) => {
        console.log(err)
      messageElement.textContent = "Oops! something went wron please try again";
    });

  const maxRequestsPerMinute = 60; // Adjust as per the rate limit
  const requestInterval = (60 * 1000) / maxRequestsPerMinute; // Calculate the interval between requests

  function makeRequest() {
    fetch(API_UTL, requestOptions)
      .then((res) => {
        if (res.status === 429) {
          // Too Many Requests, implement backoff
          setTimeout(makeRequest, requestInterval);
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
  }

  // Initial request
  // makeRequest();
};

const handleChat =()=>{
    userMessage = chatInput.value.trim()
    if(!userMessage) return;
    chatInput.value = ""
    chatInput.style.height = `${inputInHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"))
    chatbox.scrollTo(0,chatbox.scrollHeight)

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

sendBtn.addEventListener("click",handleChat)
chatInput.addEventListener("input",()=>{
  chatInput.style.height = `${inputInHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
})
chatInput.addEventListener("keyup",(e)=>{
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth >800){
    e.preventDefault()
    handleChat()
  }
})
chatInput.addEventListener("keydown",(e)=>{
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth >800){
    e.preventDefault()
    handleChat()
  }
})

chatToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);