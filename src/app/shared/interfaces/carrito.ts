export interface CarritoItem {
  producto: string;
  id_producto: number;
  precio: number;
  cantidad: number;
  total: number;
  imagen: string;
  id_carrito: string;
  id_usuario?: string;
}

export interface Carrito {
  items: CarritoItem[];
  total: number;
  id: string;
}
