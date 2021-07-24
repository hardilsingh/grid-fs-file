const ul = document.getElementById("list");

Dropzone.options.myAwesomeDropzone = {
  url: "/upload/image",
  maxFiles: 5,
  maxFilesize: 16,
  init: function () {
    this.on("success", function (file, responseText) {
      const data = {
        id: responseText.file.id,
        fileName: responseText.file.filename,
        originalName: responseText.file.originalname,
      };

      const storage = JSON.parse(localStorage.getItem("fileUploads"));

      if (storage) {
        storage.push(data);
        localStorage.setItem("fileUploads", JSON.stringify(storage));
      } else {
        localStorage.setItem("fileUploads", JSON.stringify([data]));
      }
      const li = document.createElement("a");
      li.appendChild(document.createTextNode(data.originalName));
      ul.appendChild(li);
    });
  },
};

const renderFiles = () => {
  const storage = JSON.parse(localStorage.getItem("fileUploads"));

  if (storage) {
    storage.forEach((el) => {
      const li = document.createElement("li");
      var a = document.createElement("a");
      a.textContent = el.originalName
      a.setAttribute("href", `/file/${el.fileName}`)
      a.setAttribute("target", `_blank`)
      li.appendChild(a);
      ul.appendChild(li);
    });
  }
};

renderFiles();
