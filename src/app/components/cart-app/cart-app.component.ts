import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
//import { Product } from '../../models/product';
import { CartItem } from '../../models/cartItem';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {

  //products: Product[] = [];

  items: CartItem[] = [];

  total: number = 0;

  constructor(private router: Router,
    private sharingDataService: SharingDataService,
    private service: ProductService) { }

  ngOnInit(): void {
    //this.products = this.service.findAll(); Los productos ya se manejan en el catalogo
    this.items = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.calculateTotal();
    this.onDeleteCart()
    this.onAddCart();
  }

  onAddCart(): void {
    this.sharingDataService.productEventEmitter.subscribe(product => {

      const hasItem = this.items.find(item => {
        return item.product.id === product.id;
      })
      if (hasItem) {
        this.items = this.items.map(item => {
          if (item.product.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }
          return item;
        })
      } else {
        this.items = [... this.items, { product: { ...product }, quantity: 1 }];
      }
      this.calculateTotal();
      this.saveSession();
      this.router.navigate(['/cart'], {
        state: { items: this.items, total: this.total }
      })
      Swal.fire({
        title: "Carro de compra",
        text: "Nuevo producto añadido",
        icon: "success"
      });
    });

  }
  onDeleteCart(): void {
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
      console.log(id + ' se ha ejecutado el evento idProductEventEmitter');

      Swal.fire({
        title: "¿Estas seguro?",
        text: "El cambio es irreversible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.items = this.items.filter(item => item.product.id !== id);
          // if (this.items.length == 0) {
          //sessionStorage.removeItem('cart');
          //sessionStorage.clear();//esto no es recomendable
          //}
          this.calculateTotal();
          this.saveSession();

          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/cart'], {
              state: { items: this.items, total: this.total }
            })
          })
          Swal.fire({
            title: "Eliminado",
            text: "El producto a sido eliminado con exito",
            icon: "success"
          });
        }
      });
    })
  }

  calculateTotal(): void {
    this.total = this.items.reduce((accumulator, item) =>
      accumulator + item.quantity * item.product.price, 0);
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }


}
