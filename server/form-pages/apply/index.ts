import { Form } from '../utils/decorators'
import BaseForm from '../baseForm'
import AreaAndFunding from './area-and-funding'

@Form({ sections: [AreaAndFunding] })
export default class Apply extends BaseForm {}
