import { bindingBehavior } from 'aurelia-binding';

@bindingBehavior('async')
export class AsyncBindingBehavior {
  bind(binding, source) {
    binding.originalupdateTarget = binding.updateTarget;
    binding.updateTarget = (value) => {
      if (typeof value.then === 'function') {
        value
          .then(resolvedValue => {
            binding.originalupdateTarget(resolvedValue);
          });
      } else {
        binding.originalupdateTarget(value);
      }
    };
  }
  unbind(binding) {
    binding.updateTarget = binding.originalupdateTarget;
    binding.originalupdateTarget = null;
  }
}
