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
const capture = async (dirHandle, fileName) => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    const video = document.createElement("video")

    try {
        const captureStream = await navigator.mediaDevices.getDisplayMedia()
        video.srcObject = captureStream
        context.drawImage(video, 0, 0, window.width, window.height)
        const frame = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg"))
        captureStream.getTracks().forEach(track => track.stop())
        imgFile = await createFileHandle(fileName, dirHandle)
        writeContentToFile(imgFile, frame)
    } catch (err) {
        console.error("Error: " + err);
    }
}

/**
 *
 * This is the "main" function, it starts everything on click of the button, this is required as both the filesystem
 * and the display APIs require to be triggered through a user gesture or else it fails to execute
 *
 */
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
    imgName = `${date.getUTCHours()} + ${date.getUTCMinutes()} + ${date.getUTCSeconds()}.jpg`
    capture(folder.handle, imgName)
    window.open("https://trilogy-group.github.io/ScreenRecorderDemo/tracker/index.html?folder=" + fileName)
};
