import {AssetSource, definePlugin} from 'sanity'
import {SmartImageAssetSource} from './components/SmartImageSource'

export const smartImageAssetSource: AssetSource = {
  name: 'smart-image',
  title: 'Smart Image',
  component: SmartImageAssetSource,
  // icon: Icon,
}

export const smartImageAsset = definePlugin({
  name: 'asset-source-smart-image',
  form: {
    image: {
      assetSources: (prev) => [...prev, smartImageAssetSource],
    },
  },
})
