export interface Producto {
  destacado: number;
  nombre: string;
  id_producto: number;
  id_subcategoria: number;
  precio: number;
  vendible: number;
  stock: number;
  garantia: number;
  iva: number;
  imagenes: Imagen[];
}

export interface Imagen {
  nombre: string;
  id_producto_imagen: number;
  orden: number;
}
