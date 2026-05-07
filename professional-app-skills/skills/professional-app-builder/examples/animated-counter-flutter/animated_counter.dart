import 'package:flutter/material.dart';

/// AnimatedCounter — Flutter implementation
///
/// A drop-in widget that animates from 0 to [end] over [duration].
/// Use this for ALL numeric displays in the app.
///
/// Usage:
///   AnimatedCounter(end: 1234)
///   AnimatedCounter(end: 99, duration: Duration(milliseconds: 600))
///   AnimatedCounter(end: 1500, prefix: '\$', suffix: '+')
///
class AnimatedCounter extends StatefulWidget {
  final int end;
  final Duration duration;
  final TextStyle? style;
  final String prefix;
  final String suffix;
  final Curve curve;

  const AnimatedCounter({
    super.key,
    required this.end,
    this.duration = const Duration(milliseconds: 1000),
    this.style,
    this.prefix = '',
    this.suffix = '',
    this.curve = Curves.easeOut,
  });

  @override
  State<AnimatedCounter> createState() => _AnimatedCounterState();
}

class _AnimatedCounterState extends State<AnimatedCounter>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _animation = Tween<double>(begin: 0, end: widget.end.toDouble()).animate(
      CurvedAnimation(parent: _controller, curve: widget.curve),
    );
    _controller.forward();
  }

  @override
  void didUpdateWidget(covariant AnimatedCounter oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.end != widget.end) {
      _animation = Tween<double>(
        begin: _animation.value,
        end: widget.end.toDouble(),
      ).animate(CurvedAnimation(parent: _controller, curve: widget.curve));
      _controller
        ..reset()
        ..forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Text(
          '${widget.prefix}${_animation.value.toInt()}${widget.suffix}',
          style: widget.style,
        );
      },
    );
  }
}
