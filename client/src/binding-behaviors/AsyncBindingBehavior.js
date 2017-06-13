import { bindingBehavior } from 'aurelia-binding';

@bindingBehavior('async')
export class AsyncBindingBehavior {
  bind(binding, source) {
    binding.originalUpdateTarget = binding.updateTarget;
    binding.updateTarget = (value) => {
      if (typeof value.then === 'function') {
        value
          .then(resolvedValue => {
            binding.originalUpdateTarget(resolvedValue);
          });
      } else {
        binding.originalUpdateTarget(value);
      }
    };
  }
  unbind(binding) {
    binding.updateTarget = binding.originalUpdateTarget;
    binding.originalUpdateTarget = null;
  }
}
