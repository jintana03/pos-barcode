# POS สแกนบาร์โค้ด (โปรเจคแยก)

โปรเจค POS แยกจาก `pos-offline` สำหรับจุดคิดเงินที่ต้องการใช้เครื่องสแกนบาร์โค้ดหรือกล้องมือถือ

- โฟลเดอร์โปรเจค: `POS-BARCODE`
- URL หลังสร้าง GitHub repository และเปิด Pages: `https://jintana03.github.io/pos-barcode/`
- ร้านกิจไพศาล: `https://jintana03.github.io/pos-barcode/kitpaisan/`
- ร้านกิจมงคล: `https://jintana03.github.io/pos-barcode/kitmongkol/`
- ใช้ฐานข้อมูลชุดเดียวกับ `pos-offline` โดยร้านกิจไพศาลใช้ `shop_key=kitpaisan` และร้านกิจมงคลใช้ `shop_key=kitmongkol`
- เครื่องสแกน USB แบบแป้นพิมพ์: คลิกช่องสแกน แล้วสแกนสินค้า เครื่องจะส่ง Enter ให้อัตโนมัติ
- กล้องมือถือ: กด `เปิดกล้อง` แล้วเล็งไปที่บาร์โค้ด
- ข้อมูลสินค้า ราคา การตั้งค่าร้าน และประวัติการขายจึงเชื่อมกันระหว่าง `pos-offline` กับ `pos-barcode`
