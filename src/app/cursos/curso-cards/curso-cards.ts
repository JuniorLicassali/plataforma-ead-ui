import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-cards-cursos',
  imports: [ButtonModule, 
            CardModule,
            IconFieldModule, 
            InputIconModule, 
            InputTextModule],
  templateUrl: './curso-cards.html',
  styleUrl: './curso-cards.scss',
})
export class CardsCursos {

  cursos: any[] = [];
  
    ngOnInit() {
          this.cursos = [
              {
                  titulo: 'Spring Boot Expert',
                  foto: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
                  descricao: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate nequequas',
                  matricula: 'ATIVA'
                },
              {
                  titulo: 'Advanced Card',
                  foto: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
                  descricao: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate nequequas'
              
              },
              {
                  titulo: 'Advanced Card',
                  foto: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
                  descricao: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate nequequas'
              
              },
              {
                  titulo: 'Advanced Card',
                  foto: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
                  descricao: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate nequequas'
              
              },
              {
                  titulo: 'Advanced Card',
                  foto: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
                  descricao: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate nequequas'
              
              },
              {
                  titulo: 'Advanced Card',
                  foto: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
                  descricao: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate nequequas'
              
              },
              {
                  titulo: 'Advanced Card',
                  foto: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
                  descricao: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate nequequas'
              
              },
              {
                  titulo: 'Advanced Card',
                  foto: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
                  descricao: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate nequequas'
              
              }
          ];
      }

}
