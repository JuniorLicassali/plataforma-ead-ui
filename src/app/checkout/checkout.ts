import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { CheckoutService } from './checkout-service';
import { ErrorHandlerService } from '../core/error-handler-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-checkout',
  imports: [TabsModule, ButtonModule, CardModule, ProgressSpinnerModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit, OnDestroy {
  dadosCheckout: any;
  invoiceUrl: string = '';
  loading: boolean = false;

  private timerMonitoramento: any;

  private router = inject(Router);
  private checkoutService = inject(CheckoutService);
  private errorHandler = inject(ErrorHandlerService);
  private title = inject(Title);

  ngOnInit() {
    this.carregarDadosDaNavegacao();
    this.title.setTitle('Checkout');
  }

  ngOnDestroy() {
    this.pararMonitoramento();
  }

  private carregarDadosDaNavegacao() {
    const estado = history.state;

    if (estado && estado.matricula.cursoId) {
      this.dadosCheckout = estado;
    } else {
      this.router.navigate(['/cursos']);
    }
  }

  gerarPagamento() {
    this.loading = true;

    const payload = {
      matricula: {
        cursoId: this.dadosCheckout.matricula.cursoId,
      },
      preco: this.dadosCheckout.preco,
      metodoPagamento: this.dadosCheckout.metodoPagamento,
    };

    this.checkoutService
      .gerarPagamento(payload)
      .then((res) => {
        this.invoiceUrl = res.asaasInvoiceUrl;
        this.abrirInvoiceUrl();
        this.loading = false;

        const idParaMonitorar = res.matricula.id || this.dadosCheckout.matricula.id;
        this.iniciarMonitoramento(idParaMonitorar);
      })
      .catch((erro) => {
        this.loading = false;
        this.errorHandler.handle(erro);
      });
  }

  abrirInvoiceUrl() {
    if (this.invoiceUrl) {
      window.open(this.invoiceUrl, '_blank');
    }
  }

  iniciarMonitoramento(matriculaId: number) {
    if (this.timerMonitoramento) clearTimeout(this.timerMonitoramento);

    const verificar = () => {
      this.checkoutService
        .consultarStatusMatricula(matriculaId)
        .then((matricula) => {
          if (matricula.statusMatricula === 'PAGAMENTO_CONFIRMADO') {
            clearTimeout(this.timerMonitoramento);
            this.router.navigate(['/conteudo', this.dadosCheckout.matricula.cursoId]);
          } else {
            this.timerMonitoramento = setTimeout(verificar, 5000);
          }
        })
        .catch((erro) => {
          console.warn('Erro ao consultar, tentando novamente...', erro);
          this.timerMonitoramento = setTimeout(verificar, 5000);
        });
    };

    verificar();
  }

  private pararMonitoramento() {
    if (this.timerMonitoramento) {
      clearTimeout(this.timerMonitoramento);
      this.timerMonitoramento = null;
    }
  }
}
