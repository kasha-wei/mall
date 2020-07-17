export default{
  addCart (context, payload) {
    return new Promise ((resolve, reject) => {
      // 查找之前数组是否有该商品
      let oldProduct = context.state.cartList.find(item => {
        return item.iid === payload.iid
      })
      if (oldProduct) {
        context.commit('addCounter', oldProduct) 
        resolve('当前商品数量加一')      
      } else {
        context.commit('addToCart', payload)
        resolve('添加商品成功')
      }
    })
  }
} 