export default {
  formatLineBreakers: text => {
    return text.replace(/(\r\n|\n|\r)/gm, '<br/><br/>')
  }
}
