const dec2hex = dec => dec.toString(16).padStart(2, "0")

const randomString = (len = 40) => {
    const arr = new Uint8Array(len / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

export default randomString;