import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_2_28_0_1 } from './v2.28.0_1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_2_28_0_1],
})
