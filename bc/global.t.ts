import es from './src/messages/es.json'
import ru from './src/messages/ru.json'

declare global {
  type IntlMessages = {} & typeof es & typeof ru
}
