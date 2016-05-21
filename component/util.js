export const formatSize = (byte = 0) => {
    byte = parseInt(byte)
    if (byte / 1000000 > 1) {
        return `${(parseInt(byte) / 1000000).toFixed(2)}m`
    }
    return `${(parseInt(byte) / 1000).toFixed(2)}k`
}
