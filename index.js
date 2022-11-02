/**
 *
 * All file related stuff
 *
 */
const createFileHandle = async (name, directoryHandle) => {
    return await directoryHandle.getFileHandle(name, { create: true })
}

const writeContentToFile = async (fileHandle, content) => {
    const writable = await fileHandle.createWritable()
    await writable.write(content)
    await writable.close()
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

/**
 *
 * All screen capture code
 *
 */
const displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false
};

const video = document.getElementById("video")
const canvas = document.createElement("canvas")
canvas.width = video.videoWidth
canvas.height = video.videoHeight
const context = canvas.getContext("2d")
const capture = async (dirHandle, fileName) => {
    try {
        const captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
        video.srcObject = captureStream
        context.drawImage(video, 0, 0)
        const frame = canvas.toBlob((blob) => { /* … */ }, 'image/jpeg', 1)
        //captureStream.getTracks().forEach(track => track.stop())
        imgFile = await createFileHandle(fileName, dirHandle)
        writeContentToFile(imgFile, frame)
    } catch (err) {
        console.error("Error: " + err);
    }
}

document.querySelector(".scrshot").onclick = async () => {
    const frame = canvas.toBlob((blob) => { /* … */ }, 'image/jpeg', 1)
    const date = new Date
    const imgName = `${date.getUTCHours()}-${date.getUTCMinutes()}-${date.getUTCSeconds()}.jpg`
    imgFile = await createFileHandle(imgName, folder.handle)
    writeContentToFile(imgFile, frame)
}

/**
 *
 * This is the "main" function, it starts everything on click of the button, this is required as both the filesystem
 * and the display APIs require to be triggered through a user gesture or else it fails to execute
 *
 */
let folder
document.querySelector(".pick-dir").onclick = async () => {
    const readWriteOptions = { mode: 'readwrite' }
    const setRootDirectory = async () => {
        const handle = await (window).showDirectoryPicker()
        if (!handle) {
            return undefined
        }
        let granted = (await handle.queryPermission(readWriteOptions)) === 'granted'
        if (!granted) {
            granted = (await handle.requestPermission(readWriteOptions)) === 'granted'
        }
        return { handle, granted }
    }
    folder = await setRootDirectory()
    fileName = uuidv4() + ".txt"
    uuidFile = await createFileHandle(fileName, folder.handle)
    writeContentToFile(uuidFile, fileName)
    const date = new Date
    const imgName = `${date.getUTCHours()}-${date.getUTCMinutes()}-${date.getUTCSeconds()}.jpg`
    capture(folder.handle, imgName)
    window.open("https://trilogy-group.github.io/ScreenRecorderDemo/tracker/index.html?folder=" + fileName)
};
