import { Component, ViewChild, ElementRef, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-recomendacion-ia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendacion-ia.html',
  styleUrl: './recomendacion-ia.css'
})
export class RecomendacionIa implements OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  stream: MediaStream | null = null;
  fotoBase64: string | null = null;
  
  estado: 'INICIO' | 'CAMARA' | 'PROCESANDO' | 'RESULTADO' | 'ERROR' = 'INICIO';
  resultados: { base64: string, estilo: string, descripcion: string }[] = [];
  mensajeError = '';

  activarCamara() {
    this.estado = 'CAMARA';
    // Usamos video: true genérico para que funcione en PC de escritorio y notebooks sin fallar
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        // Esperar un tick para que el @ViewChild se renderice
        setTimeout(() => {
          if (this.videoElement) {
            this.videoElement.nativeElement.srcObject = stream;
            this.videoElement.nativeElement.play();
          }
        }, 100);
      })
      .catch(err => {
        this.estado = 'ERROR';
        if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          this.mensajeError = 'No se encontró ninguna cámara conectada a esta computadora. Conecta una webcam para probar esta función.';
        } else {
          this.mensajeError = 'No se pudo acceder a la cámara. Revisa los permisos de tu navegador.';
        }
        console.error("Error de cámara:", err);
      });
  }

  tomarFoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dibujar la foto
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Guardarla como Base64 (JPG)
      this.fotoBase64 = canvas.toDataURL('image/jpeg', 0.8);
      this.detenerCamara();
      this.enviarFotoAIa();
    }
  }

  // PLAN B: Subir foto manualmente
  subirFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoBase64 = e.target.result;
        this.enviarFotoAIa();
      };
      reader.readAsDataURL(file);
    }
  }

  detenerCamara() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  enviarFotoAIa() {
    this.estado = 'PROCESANDO';
    this.http.post<any>(`${environment.API_BASE_URL}/ia/recomendar`, { imagen: this.fotoBase64 })
      .subscribe({
        next: (res) => {
          this.resultados = res.imagenes;
          this.estado = 'RESULTADO';
          this.cdr.detectChanges(); // Forzamos el repintado de la pantalla
        },
        error: (err) => {
          this.estado = 'ERROR';
          this.mensajeError = 'La IA de Google está sobrecargada o hubo un error en la conexión. Intenta nuevamente.';
          console.error(err);
          this.cdr.detectChanges();
        }
      });
  }

  reintentar() {
    this.estado = 'INICIO';
    this.fotoBase64 = null;
    this.resultados = [];
  }

  reservar() {
    this.router.navigate(['/cliente/turnos']);
  }

  ngOnDestroy() {
    this.detenerCamara();
  }
}
