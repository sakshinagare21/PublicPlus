import os
from datasets import load_dataset
from tqdm import tqdm
from PIL import Image

# Configuration
DATASET_NAME = "Parveshiiii/AI-vs-Real"
SAVE_DIR = "./dataset"
TRAIN_RATIO = 0.8  # 80% for training, 20% for validation

# Map labels to folder names based on Parveshiiii/AI-vs-Real:
# 0: AI, 1: Real
INDEX_TO_CLASS = {0: "ai", 1: "real"}

def download_and_organize():
    print(f"Loading dataset '{DATASET_NAME}'...")
    # Loading 'train' split and then manually splitting for val
    # We use verification_mode="no_checks" because the HF metadata has a slight mismatch with the actual file count
    dataset = load_dataset(DATASET_NAME, split='train', verification_mode="no_checks")
    
    # Shuffle the dataset
    dataset = dataset.shuffle(seed=42)
    
    num_total = len(dataset)
    num_train = int(num_total * TRAIN_RATIO)
    
    print(f"Total images: {num_total}")
    print(f"Organizing into: {num_train} train, {num_total - num_train} val")

    splits = {
        "train": dataset.select(range(num_train)),
        "val": dataset.select(range(num_train, num_total))
    }

    for split_name, ds_split in splits.items():
        print(f"Processing {split_name} split...")
        for i, example in enumerate(tqdm(ds_split)):
            # The column name in this dataset is 'binary_label'
            label_idx = example['binary_label']
            class_name = INDEX_TO_CLASS[label_idx]
            
            # Create target directory
            target_dir = os.path.join(SAVE_DIR, split_name, class_name)
            os.makedirs(target_dir, exist_ok=True)
            
            # Save image
            img = example['image']
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            img_filename = f"{split_name}_{i}.jpg"
            img.save(os.path.join(target_dir, img_filename))

    print("Success! Dataset organized in './dataset' folder.")

if __name__ == "__main__":
    download_and_organize()
