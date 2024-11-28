export async function convertImage(file: File, outputFormat: 'png' | 'jpg', jpegQuality: number = 0.9): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')

                if (!ctx) {
                    reject(new Error('Failed to get canvas context'))
                    return
                }

                ctx.drawImage(img, 0, 0)

                if (outputFormat === 'jpg') {
                    // Fill white background for JPG (since JPG doesn't support transparency)
                    ctx.globalCompositeOperation = 'destination-over'
                    ctx.fillStyle = 'white'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                }

                const dataUrl = canvas.toDataURL(`image/${outputFormat}`, outputFormat === 'jpg' ? jpegQuality : undefined)
                resolve(dataUrl)
            }
            img.onerror = () => {
                reject(new Error('Failed to load image'))
            }
            img.src = event.target?.result as string
        }
        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }
        reader.readAsDataURL(file)
    })
}

