'use client'

import {useState, useRef, useCallback} from 'react'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Label} from "@/components/ui/label"
import {Slider} from "@/components/ui/slider"
import {Download, Upload} from 'lucide-react'
import {convertImage} from './utils/imageConverter'
import {Footer} from './components/footer'

export default function ImageConverter() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [outputFormat, setOutputFormat] = useState<'png' | 'jpg'>('png')
    const [jpegQuality, setJpegQuality] = useState<number>(90)
    const [convertedImage, setConvertedImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dropZoneRef = useRef<HTMLDivElement>(null)

    const handleFileChange = useCallback((file: File) => {
        if (file && (file.type === 'image/avif' || file.type === 'image/webp')) {
            setSelectedFile(file)
            setError(null)
        } else {
            setSelectedFile(null)
            setError('Please select a valid WebP or AVIF image.')
        }
    }, [])

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        handleFileChange(file)
    }, [handleFileChange])

    const handleConvert = async () => {
        if (!selectedFile) return

        try {
            const result = await convertImage(selectedFile, outputFormat, jpegQuality / 100)
            setConvertedImage(result)
            setError(null)
        } catch (err) {
            setError('Error converting image. Please try again.')
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Image Converter</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            ref={dropZoneRef}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
                            }`}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/avif,image/webp"
                                onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <Upload className="mx-auto h-12 w-12 text-gray-400"/>
                            <p className="mt-2 text-sm text-gray-600">Drag and drop your WebP or AVIF image here, or</p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="mt-2"
                            >
                                Choose File
                            </Button>
                            {selectedFile && (
                                <p className="mt-2 text-sm text-gray-500">Selected: {selectedFile.name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="output-format">Output Format</Label>
                            <Select onValueChange={(value: 'png' | 'jpg') => setOutputFormat(value)}>
                                <SelectTrigger id="output-format" className="w-full mt-1">
                                    <SelectValue placeholder="Select output format"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="png">PNG</SelectItem>
                                    <SelectItem value="jpg">JPG</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {outputFormat === 'jpg' && (
                            <div>
                                <Label htmlFor="jpeg-quality">JPEG Quality: {jpegQuality}%</Label>
                                <Slider
                                    id="jpeg-quality"
                                    min={1}
                                    max={100}
                                    step={1}
                                    value={[jpegQuality]}
                                    onValueChange={(value) => setJpegQuality(value[0])}
                                    className="mt-2"
                                />
                            </div>
                        )}

                        <Button
                            onClick={handleConvert}
                            disabled={!selectedFile}
                            className="w-full"
                        >
                            Convert Image
                        </Button>

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        {convertedImage && (
                            <div className="mt-4 space-y-4">
                                <h3 className="text-lg font-semibold">Converted Image:</h3>
                                <img src={convertedImage} alt="Converted"
                                     className="max-w-full h-auto rounded-lg shadow-md"/>
                                <Button
                                    asChild
                                    className="w-full"
                                    variant="outline"
                                >
                                    <a
                                        href={convertedImage}
                                        download={`converted.${outputFormat}`}
                                    >
                                        <Download className="mr-2 h-4 w-4"/>
                                        Download {outputFormat.toUpperCase()}
                                    </a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            <Footer/>
        </div>
    )
}

