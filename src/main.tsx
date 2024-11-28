import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ImageConverter from "@/image-converter.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*<App />*/}
    <ImageConverter />
  </StrictMode>,
)
