import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputFormat?: "webp" | "jpeg";
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.85,
  outputFormat: "webp",
};

/**
 * Comprime e otimiza uma imagem antes do upload
 * @param file - Arquivo de imagem original
 * @param options - Opções de compressão
 * @returns Promise com o arquivo comprimido
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Criar canvas para redimensionar
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Não foi possível obter contexto do canvas"));
            return;
          }

          // Calcular novas dimensões mantendo proporção
          let { width, height } = img;
          const maxWidth = opts.maxWidth!;
          const maxHeight = opts.maxHeight!;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          // Configurar canvas
          canvas.width = width;
          canvas.height = height;

          // Desenhar imagem redimensionada
          ctx.drawImage(img, 0, 0, width, height);

          // Converter para blob com compressão
          const mimeType =
            opts.outputFormat === "webp" ? "image/webp" : "image/jpeg";

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Erro ao comprimir imagem"));
                return;
              }

              // Criar novo arquivo com o blob comprimido
              const extension = opts.outputFormat === "webp" ? ".webp" : ".jpg";
              const originalName = file.name.replace(/\.[^/.]+$/, "");
              const compressedFile = new File(
                [blob],
                `${originalName}${extension}`,
                { type: mimeType }
              );

              // Log de estatísticas
              const originalSize = file.size / 1024;
              const compressedSize = compressedFile.size / 1024;
              const reduction =
                ((originalSize - compressedSize) / originalSize) * 100;

              console.log("📊 Compressão de imagem:");
              console.log(`   Tamanho original: ${originalSize.toFixed(1)} KB`);
              console.log(`   Tamanho final: ${compressedSize.toFixed(1)} KB`);
              console.log(`   Redução: ${reduction.toFixed(1)}%`);
              console.log(
                `   Dimensões: ${img.width}x${img.height} → ${width}x${height}`
              );

              resolve(compressedFile);
            },
            mimeType,
            opts.quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Erro ao carregar imagem"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler arquivo"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Valida se o arquivo é uma imagem
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Valida o tamanho do arquivo
 */
export function isFileSizeValid(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}
