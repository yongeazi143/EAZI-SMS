const recipientForm = document.getElementById("addRecipient");
const sendMessages = document.getElementById("sendMessage");
const recipientInput = document.getElementById("recepientInput");
const recepientList = document.getElementById("recipientLists");
const passcodeInput = sendMessages.querySelector("#passcode");
const messageTextarea = sendMessages.querySelector("#message");
const sendButton = sendMessages.querySelector("#send-message-button");
// import f from '../../functions/send-messages'
const recipient = [];

const addRecipientToList = (phoneNumber) => {
  recipient.push(phoneNumber);
  recepientList.innerHTML = "";
  for (let i = 0; i < recipient.length; i++) {
    recepientList.innerHTML += `<li>${recipient[i]}</li>`;
  }
};

function padNumber(phoneNumber) {
  if (phoneNumber.startsWith("0")) return phoneNumber.replace(/^0/, "+234");
  return phoneNumber;
}

function resetInput(input) {
  input.value = "";
}

function resetForm() {
  recepientList.innerHTML = null;
  recipient.length = 0;
  messageTextarea.value = "";
  passcodeInput.value = "";
}

const addPhoneNumberToList = (event) => {
  // ! Prevent Form From Reloading The Page 😀😀😀
  event.preventDefault();
  let validPhoneNumber = recipientInput.value.trim();
  if (!validPhoneNumber) {
    iziToast.error({
      title: "Unexpected Value",
      message: "Please Enter A Valid Number",
      position: "topRight",
    });
    return;
  }
  addRecipientToList(padNumber(validPhoneNumber));
  resetInput(recipientInput);
};

const sendFormData = async (form) => {
  sendButton.innerText = "Submitting...";
  sendButton.disabled = true;

  sendButton.style.cursor = "not-allowed";

  try {
    const data = {
      passcode: form.passcode.value,
      message: form.message.value,
      recipients: recipient.join(","),
    };

    const response = await fetch("../../functions/send-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const body = await response.json();
      const resultCount = body.result.reduce((currentCount, resultItem) => {
        return resultItem.success ? currentCount + 1 : currentCount;
      }, 0);

      if (resultCount === 0) {
        iziToast.error({
          message: `Sent ${resultCount} of ${body.result.length} messages.`,
          position: "center",
        });
      } else {
        iziToast.success({
          message: `Sent ${resultCount} of ${body.result.length} messages.`,
          position: "center",
        });
      }
    } else if (response.status === 401) {
      iziToast.error({
        title: "Incorrect PassCode",
        message: "Please Enter A Valid PassCode",
        position: "topRight",
      });
    } else {
      iziToast.error({
        title: "Unexpected Error",
        message: "An unexpected error occurred. Please try again.",
        position: "topRight",
      });
    }
  } catch (error) {
    iziToast.error({
      title: "Unexpected Error",
      message: error.message,
    });
  } finally {
    sendButton.innerText = "Submit";
    sendButton.disabled = false;
    sendButton.style.cursor = "pointer";
  }
};

//* Send
const sendMessagesHandler = (event) => {
  event.preventDefault();
  if (recipient.length === 0) {
    iziToast.error({
      title: "Unexpected Value",
      message: "Please No Number Added",
      position: "topRight",
    });
    return;
  }
  if (!passcodeInput.value.trim() || !messageTextarea.value.trim()) {
    iziToast.error({
      title: "Unexpected Value",
      message: "Please Enter A Valid PassCode Or Message",
      position: "topRight",
    });
    return;
  }
  sendFormData(event.target);
  resetForm();
};

sendMessages.addEventListener("submit", sendMessagesHandler);
recipientForm.addEventListener("submit", addPhoneNumberToList);
