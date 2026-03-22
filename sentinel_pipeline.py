from typing import Dict, Any, Callable
from sentinel_preprocess import SentinelPreprocessor
from sentinel_postprocess import SentinelPostprocessor

class SentinelPipeline:
    def __init__(self, platform_type: str, safety_fn: Callable):
        self.pre = SentinelPreprocessor(platform_type)
        self.post = SentinelPostprocessor(platform_type)
        self.safety_fn = safety_fn
        self.last_state = None

    def run(self, raw_msg: Any, sensor_data: Dict[str, Any]) -> Any:
        # 1. Pre-process
        filtered_cmd, state = self.pre.process(raw_msg, sensor_data)
        self.last_state = state
        
        # 2. Existing Safety Check (The Governor)
        # We wrap the existing logic to fit the pipeline
        governed_msg = self.safety_fn(filtered_cmd, state)
        
        # 3. Post-process
        final_cmd = self.post.process(governed_msg, state)
        
        return final_cmd

    def get_state(self):
        return self.last_state
