# Guide de Contribution

Merci de votre intérêt pour contribuer à EssentiElles ! 🎉

## Code of Conduct

En participant à ce projet, vous acceptez de respecter notre code de conduite:
- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Focalisez sur ce qui est meilleur pour la communauté

## Comment Contribuer

### Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les Issues
2. Créez une nouvelle Issue avec:
   - Titre clair et descriptif
   - Description détaillée du problème
   - Steps to reproduce
   - Comportement attendu vs comportement actuel
   - Screenshots si applicable
   - Environment (OS, versions, etc.)

### Proposer une Fonctionnalité

1. Ouvrez une Issue de type "Feature Request"
2. Décrivez clairement la fonctionnalité et son intérêt
3. Attendez les retours avant de commencer l'implémentation

### Soumettre une Pull Request

1. **Fork** le repository
2. **Clone** votre fork localement
3. **Créer une branche** depuis `develop`:
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```

4. **Développer**:
   - Suivre les conventions de code
   - Ajouter des tests
   - Mettre à jour la documentation

5. **Tester**:
   ```bash
   # Backend
   cd backend && pytest
   
   # Frontend
   cd frontend && yarn test && yarn lint
   ```

6. **Commit** avec des messages clairs:
   ```bash
   git commit -m "feat: ajouter fonctionnalité X"
   ```

7. **Push** vers votre fork:
   ```bash
   git push origin feature/ma-fonctionnalite
   ```

8. **Créer une Pull Request** sur GitHub

## Conventions de Code

### Backend (Python)

- **Style**: PEP 8, enforced by Black
- **Imports**: Ordonnés par isort
- **Type hints**: Utiliser partout où possible
- **Docstrings**: Google style pour les fonctions publiques

```python
def calculate_price(quantity: int, unit_price: float) -> float:
    """
    Calculate total price based on quantity and unit price.
    
    Args:
        quantity: Number of items
        unit_price: Price per item
        
    Returns:
        Total price rounded to 2 decimals
    """
    return round(quantity * unit_price, 2)
```

### Frontend (TypeScript)

- **Style**: ESLint config
- **Naming**: 
  - Components: PascalCase (`ProductCard.tsx`)
  - Functions: camelCase (`fetchProducts`)
  - Constants: UPPER_SNAKE_CASE (`API_URL`)
- **Types**: Définir des interfaces pour les props

```typescript
interface ProductCardProps {
  product: Product;
  onPress: (id: string) => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  // Implementation
}
```

## Git Workflow

### Branches

- `main` - Production, stable
- `develop` - Développement, features intégrées
- `feature/*` - Nouvelles fonctionnalités
- `fix/*` - Corrections de bugs
- `hotfix/*` - Corrections urgentes en production

### Commit Messages

Format: `<type>(<scope>): <subject>`

Types:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatting, no code change
- `refactor`: Refactoring
- `test`: Ajout de tests
- `chore`: Maintenance, dependencies

Exemples:
```bash
feat(auth): ajouter login avec Google
fix(cart): corriger calcul du total
docs(readme): mettre à jour instructions d'installation
```

## Tests

### Backend

```bash
cd backend

# Tous les tests
pytest

# Avec coverage
pytest --cov=. --cov-report=html

# Tests spécifiques
pytest tests/test_auth.py::test_login -v
```

### Frontend

```bash
cd frontend

# Tous les tests
yarn test

# Mode watch
yarn test --watch

# Coverage
yarn test --coverage
```

## Review Process

1. Les Pull Requests doivent:
   - ✅ Passer tous les tests CI
   - ✅ Avoir au moins 1 review approuvé
   - ✅ Respecter les conventions de code
   - ✅ Inclure des tests si nécessaire
   - ✅ Mettre à jour la documentation

2. Les maintainers vont:
   - Reviewer le code dans les 48h
   - Demander des changements si nécessaire
   - Merger une fois approuvé

## Questions ?

- Ouvrez une Issue
- Contactez-nous sur support@essentielles.com

Merci pour votre contribution ! 🙏
