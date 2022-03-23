const videoContent = document.querySelector("#videoContent");
const form = document.querySelector("#commentForm");
const videoComments = document.querySelector(".video__comment-ul");
const textarea = document.querySelector("textarea");

const addComment = function (text, id) {
  const newComment = document.createElement("li");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  const remove = document.createElement("a");
  const i = document.createElement("i");
  remove.setAttribute("href", "#");
  i.setAttribute("class", "fa-solid fa-xmark");
  span.innerText = `${text}`;
  remove.appendChild(i);
  span2.appendChild(remove);
  newComment.append(span, span2);
  newComment.dataset.id = id;
  videoComments.prepend(newComment);
};
const handleSubmit = async function (evt) {
  evt.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContent.dataset.id;
  if (text === "" || text.trim() === "") return false;
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  if (response.status === 201) {
    textarea.value = "";
    //response에 있는 json 추출
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleXBtn = async function (evt) {
  const { target } = evt;
  if (target.localName === "li") return false;
  const li = target.closest("li");
  if (!li) return false;
  const id = li.getAttribute("data-id");
  if (!id) return false;
  const response = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    videoComments.removeChild(li);
  }
};

if (form) form.addEventListener("submit", handleSubmit);
document.addEventListener("click", handleXBtn);
