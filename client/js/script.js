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
      const li = document.createElement("li");
      var p = document.createElement("p");
      const downloadBtn = document.createElement("a");
      downloadBtn.textContent = "Download"
      downloadBtn.setAttribute("href", `/file/${data.fileName}`)
      downloadBtn.setAttribute("download", `${data.fileName}`)
      const openFile = document.createElement("a");
      openFile.textContent = "Open"
      openFile.setAttribute("href", `/file/${data.fileName}`)
      openFile.setAttribute("target", `blank`)
      p.textContent = data.originalName
      li.appendChild(p);
      li.appendChild(downloadBtn);
      li.appendChild(openFile);
      ul.appendChild(li);
    });
  },
};

const renderFiles = () => {
  const storage = JSON.parse(localStorage.getItem("fileUploads"));

  if (storage) {
    storage.forEach((el) => {
      const li = document.createElement("li");
      var p = document.createElement("p");
      const downloadBtn = document.createElement("a");
      downloadBtn.textContent = "Download"
      downloadBtn.setAttribute("href", `/file/${el.fileName}`)
      downloadBtn.setAttribute("download", `${el.fileName}`)
      const openFile = document.createElement("a");
      openFile.textContent = "Open"
      openFile.setAttribute("href", `/file/${el.fileName}`)
      openFile.setAttribute("target", `blank`)
      p.textContent = el.originalName
      li.appendChild(p);
      li.appendChild(downloadBtn);
      li.appendChild(openFile);
      ul.appendChild(li);
    });
  }
};

renderFiles();
