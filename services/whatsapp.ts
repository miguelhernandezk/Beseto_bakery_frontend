const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export const sendWhatsappMessage = (_id: string) => {
  window.open(
    `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=Hola+me+podría+proporcionar+info+de+est+pastel%3F+https%3A%2F%2Fwww.beseto.com.mx%2Fproducts%2F${_id}&type=phone_number&app_absent=0`,
    '_blank'
  );
};
