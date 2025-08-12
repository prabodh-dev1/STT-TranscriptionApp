#!/bin/bash
# Script to fix TypeScript syntax in React Native JavaScript files

echo "Fixing TypeScript syntax in React Native JavaScript files..."

# Fix const declarations with type annotations
find node_modules/react-native -name "*.js" -exec sed -i '' 's/const exported: component(/const exported = (/g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/) = Platform\.select/{/g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/const \([A-Za-z]*\): component(/const \1 = React.forwardRef(/g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/) = React\.forwardRef((\([^:]*\): [^,]*, \([^:]*\): [^)]*) => {/) => {/g' {} \;

# Fix 'as' type casting (single line)
find node_modules/react-native -name "*.js" -exec sed -i '' 's/ as ReactNativePublicAPI;//g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/ as {[^}]*};//g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/) as {.*$/);/g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/) as component([^)]*);$/);/g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/ as \$FlowFixMe as [^;]*;$/;/g' {} \;

# Fix function parameter type annotations  
find node_modules/react-native -name "*.js" -exec sed -i '' 's/ref?: React\.RefSetter<[^>]*>,//g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/\.\.\.props: [A-Za-z]*Props//g' {} \;

# Fix React.forwardRef duplications
find node_modules/react-native -name "*.js" -exec sed -i '' 's/React\.forwardRef(\([^,]*\),/React.forwardRef((/g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/) = React\.forwardRef(\([^)]*\));$/;/g' {} \;

# Fix type declarations - comment them out
find node_modules/react-native -name "*.js" -exec sed -i '' 's/^type \([A-Za-z]*\) = component($/\/\/ type \1 = component(/g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/^  ref\?: React\.RefSetter<.*>,$/\/\/   ref\?: React\.RefSetter<.*>,/g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/^  \.\.\.[A-Za-z]*Props$/\/\/   \.\.\.[A-Za-z]*Props/g' {} \;
find node_modules/react-native -name "*.js" -exec sed -i '' 's/^);$/\/\/ );/g' {} \;

# Fix export default with type annotations
find node_modules/react-native -name "*.js" -exec sed -i '' 's/export default (\([A-Za-z]*\): component(/export default \1;\/\/ component(/g' {} \;

# Fix multi-line type casting
find node_modules/react-native -name "*.js" -exec perl -i -pe 'BEGIN{undef $/;} s/} as \{[^}]*\};//smg' {} \;

echo "Done fixing TypeScript syntax issues!"
